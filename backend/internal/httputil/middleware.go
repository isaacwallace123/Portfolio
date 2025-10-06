package httputil

import (
	"log"
	"net/http"
	"time"
)

type CORSConfig struct {
	AllowedOrigins   []string
	AllowedMethods   []string
	AllowedHeaders   []string
	AllowCredentials bool
}

func CORSMiddleware(cfg CORSConfig) func(http.Handler) http.Handler {
	allow := func(arr []string) string {
		if len(arr) == 0 {
			return "*"
		}
		out := arr[0]
		for i := 1; i < len(arr); i++ {
			out += ", " + arr[i]
		}
		return out
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", allow(cfg.AllowedOrigins))
			w.Header().Set("Access-Control-Allow-Methods", allow(cfg.AllowedMethods))
			w.Header().Set("Access-Control-Allow-Headers", allow(cfg.AllowedHeaders))

			if cfg.AllowCredentials {
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			}

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		next.ServeHTTP(w, r)

		log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
	})
}
