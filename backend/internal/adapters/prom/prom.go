package prom

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"
)

type Client struct {
	BaseURL string
	http    *http.Client
}

func New(base string) *Client {
	return &Client{BaseURL: base, http: &http.Client{Timeout: 5 * time.Second}}
}

type promResp struct {
	Status string `json:"status"`

	Data struct {
		ResultType string `json:"resultType"`
		Result     []struct {
			Metric map[string]string `json:"metric"`
			Value  [2]interface{}    `json:"value"`
		} `json:"result"`
	} `json:"data"`
}

func (c *Client) InstantQuery(ctx context.Context, q string) (promResp, error) {
	u, _ := url.Parse(c.BaseURL + "/api/v1/query")

	qv := u.Query()
	qv.Set("query", q)

	u.RawQuery = qv.Encode()

	req, _ := http.NewRequestWithContext(ctx, "GET", u.String(), nil)

	resp, err := c.http.Do(req)

	if err != nil {
		return promResp{}, err
	}

	defer resp.Body.Close()

	var out promResp

	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return out, err
	}

	if out.Status != "success" {
		return out, fmt.Errorf("prom query failed")
	}

	return out, nil
}

type rangeResp struct {
	Status string `json:"status"`
	Data   struct {
		ResultType string `json:"resultType"`
		Result     []struct {
			Metric map[string]string `json:"metric"`
			Values [][]interface{}   `json:"values"`
		} `json:"result"`
	} `json:"data"`
}

func (c *Client) RangeQuery(ctx context.Context, q string, start, end time.Time, step time.Duration) (rangeResp, error) {
	u, _ := url.Parse(c.BaseURL + "/api/v1/query_range")
	qv := u.Query()
	qv.Set("query", q)
	qv.Set("start", fmt.Sprintf("%d", start.Unix()))
	qv.Set("end", fmt.Sprintf("%d", end.Unix()))
	qv.Set("step", fmt.Sprintf("%ds", int(step.Seconds())))
	u.RawQuery = qv.Encode()

	req, _ := http.NewRequestWithContext(ctx, "GET", u.String(), nil)
	resp, err := c.http.Do(req)
	if err != nil {
		return rangeResp{}, err
	}
	defer resp.Body.Close()

	var out rangeResp
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return out, err
	}
	if out.Status != "success" {
		return out, fmt.Errorf("prom range query failed")
	}
	return out, nil
}
