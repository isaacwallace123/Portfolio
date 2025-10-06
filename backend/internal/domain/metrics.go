package domain

type TSPoint struct {
	TS    int64
	Value float64
}

type Series struct {
	Label  string
	Metric string
	Points []TSPoint
}

type MetricsProvider interface {
	LiveUptime(instance string) (float64, error)
	LiveCPUPercent(instance string) (float64, error)
	LiveMemPercent(instance string) (float64, error)
	LiveNetMbps(instance string) (float64, error)

	RangeCPUPercent(instance string, start, end int64, stepSec int64) ([]TSPoint, error)
	RangeMemPercent(instance string, start, end int64, stepSec int64) ([]TSPoint, error)
	RangeNetMbps(instance string, start, end int64, stepSec int64) ([]TSPoint, error)
	RangeUptime(instance string, start, end int64, stepSec int64) ([]TSPoint, error)
}
