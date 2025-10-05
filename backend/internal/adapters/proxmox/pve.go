package proxmox

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	BaseURL, TokenID, TokenSecret string
	http                          *http.Client
}

func New(base, id, secret string, insecure bool) *Client {
	tr := &http.Transport{}
	if insecure {
		tr.TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
	}
	return &Client{BaseURL: base, TokenID: id, TokenSecret: secret, http: &http.Client{Timeout: 5 * time.Second, Transport: tr}}
}

func (c *Client) auth(req *http.Request) {
	req.Header.Set("Authorization", fmt.Sprintf("PVEAPIToken=%s=%s", c.TokenID, c.TokenSecret))
}

type LXC struct {
	VMID         int    `json:"vmid"`
	Name, Status string `json:"name","status"`
}

func (c *Client) ListLXC() ([]LXC, error) {
	req, _ := http.NewRequest("GET", c.BaseURL+"/nodes/proxmox/lxc", nil)
	c.auth(req)
	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var out struct {
		Data []LXC `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, err
	}
	return out.Data, nil
}
