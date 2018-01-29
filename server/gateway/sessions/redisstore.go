package sessions

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis"
	"github.com/patrickmn/go-cache"
)

//RedisStore represents a session.Store backed by redis.
type RedisStore struct {
	//Redis client used to talk to redis server.
	Client *redis.Client
	//Used for key expiry time on redis.
	SessionDuration time.Duration
}

//NewRedisStore constructs a new RedisStore
func NewRedisStore(client *redis.Client, sessionDuration time.Duration) *RedisStore {
	//initialize and return a new RedisStore struct
	return &RedisStore{
		Client:          client,
		SessionDuration: sessionDuration,
	}

}

//Store implementation

//Save saves the provided `sessionState` and associated SessionID to the store.
//The `sessionState` parameter is typically a pointer to a struct containing
//all the data you want to associated with the given SessionID.
func (rs *RedisStore) Save(sid SessionID, sessionState interface{}) error {
	key := sid.getRedisKey()
	session, err := json.Marshal(sessionState)
	if err != nil {
		return fmt.Errorf("could not marshal to json: %v", err)
	}
	return rs.Client.Set(string(key), session, cache.DefaultExpiration).Err()
}

//Get populates `sessionState` with the data previously saved
//for the given SessionID
func (rs *RedisStore) Get(sid SessionID, sessionState interface{}) error {
	key := sid.getRedisKey()
	sessionData := rs.Client.Get(string(key))
	sessionDataBytes, err := sessionData.Bytes()
	if err != nil {
		return ErrStateNotFound
	}
	err = json.Unmarshal(sessionDataBytes, sessionState)
	if err != nil {
		return fmt.Errorf("could not unmarshal data: %v", err)
	}
	return rs.Client.Expire(string(key), 0).Err()
	//could use the Pipeline feature of the redis
	//package to do both the get and the reset of the expiry time
	//in just one network round trip
}

//Delete deletes all state data associated with the SessionID from the store.
func (rs *RedisStore) Delete(sid SessionID) error {
	key := sid.getRedisKey()
	return rs.Client.Del(string(key)).Err()
}

//getRedisKey() returns the redis key to use for the SessionID
func (sid SessionID) getRedisKey() string {
	//convert the SessionID to a string and add the prefix "sid:" to keep
	//SessionID keys separate from other keys that might end up in this
	//redis instance
	return "sid:" + sid.String()
}
