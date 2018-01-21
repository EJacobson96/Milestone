package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

//main is the main entry point for the server
func main() {
	//gets the value of the ADDR environment variable
	addr := os.Getenv("ADDR")

	//If addr is not set, sets default to ":443," all requests are
	//listening on 443
	if len(addr) == 0 {
		addr = ":443"
	}

	tlsKeyPath := os.Getenv("TLSKEY")
	tlsCertPath := os.Getenv("TLSCERT")
	if len(tlsKeyPath) == 0 || len(tlsCertPath) == 0 {
		log.Fatal("please insert TLSKEY and TLSCERT")
	}
	mux := http.NewServeMux()

	fmt.Printf("server is listening at http://%s\n", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, mux))
}
