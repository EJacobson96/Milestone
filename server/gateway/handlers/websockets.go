package handlers

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

//WebSocketsHandler is a handler for WebSocket upgrade requests
type WebSocketsHandler struct {
	notifier *Notifier
	upgrader *websocket.Upgrader
}

//NewWebSocketsHandler constructs a new WebSocketsHandler
func NewWebSocketsHandler(notifer *Notifier) *WebSocketsHandler {
	return &WebSocketsHandler{
		notifier: notifer,
		upgrader: &websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin:     func(r *http.Request) bool { return true },
		},
	}
}

//ServeHTTP implements the http.Handler interface for the WebSocketsHandler
func (wsh *WebSocketsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := wsh.upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, fmt.Sprintf("error upgrading websocket: %v", err), http.StatusInternalServerError)
		return
	}
	go wsh.notifier.AddClient(conn)
}

//Notifier is an object that handles WebSocket notifications
type Notifier struct {
	clients []*websocket.Conn
	eventQ  chan []byte
	mx      *sync.RWMutex
}

//NewNotifier constructs a new Notifier
func NewNotifier() *Notifier {
	notifier := &Notifier{
		clients: make([]*websocket.Conn, 0),
		eventQ:  make(chan []byte),
		mx:      &sync.RWMutex{},
	}
	go notifier.start()
	return notifier
}

//AddClient adds a new client to the Notifier
func (n *Notifier) AddClient(client *websocket.Conn) {
	n.mx.Lock()
	n.clients = append(n.clients, client)
	n.mx.Unlock()
	for {
		if _, _, err := client.NextReader(); err != nil {
			n.removeClient(client)
			break
		}
	}
}

//Notify broadcasts the event to all WebSocket clients
func (n *Notifier) Notify(event []byte) {
	n.eventQ <- event
}

//start starts the notification loop
func (n *Notifier) start() error {
	for {
		event := <-n.eventQ
		n.mx.Lock()
		for _, client := range n.clients {
			err := client.WriteMessage(websocket.TextMessage, event)
			if err != nil {
				n.removeClient(client)
				return fmt.Errorf("error writing message: %v", err)
			}
		}
		n.mx.Unlock()
	}
}

func (n *Notifier) removeClient(client *websocket.Conn) {
	client.Close()
	for i, c := range n.clients {
		if client == c {
			n.mx.Lock()
			n.clients = append(n.clients[:i], n.clients[i+1:]...)
			n.mx.Unlock()
		}
	}
}
