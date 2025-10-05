FROM golang:1.24-alpine AS build

WORKDIR /src

RUN apk add --no-cache git

ENV GOTOOLCHAIN=auto

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/portfolio-backend ./cmd/portfolio-backend

FROM alpine:3.20
RUN apk add --no-cache libcap ca-certificates tzdata && update-ca-certificates

WORKDIR /app
COPY --from=build /out/portfolio-backend /app/portfolio-backend
RUN setcap cap_net_raw=+ep /app/portfolio-backend

RUN adduser -D -u 65532 appuser
USER 65532:65532

EXPOSE 8080
ENTRYPOINT ["/app/portfolio-backend"]
