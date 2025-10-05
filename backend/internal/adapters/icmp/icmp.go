package icmp

import (
	"time"

	"github.com/go-ping/ping"
)

func Ping(host string, deadline time.Duration) (rtt time.Duration, ok bool, err error) {
	p, err := ping.NewPinger(host)
	if err != nil {
		return 0, false, err
	}

	p.Count = 1
	p.Timeout = deadline

	p.SetPrivileged(true)

	if err = p.Run(); err != nil {
		return 0, false, err
	}

	stats := p.Statistics()
	if stats.PacketsRecv == 0 {
		return 0, false, nil
	}

	return stats.AvgRtt, true, nil
}
