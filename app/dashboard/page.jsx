/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { PaginatedTable } from "@/components";
import { Bar, Column } from "@ant-design/charts";
import { Card, message } from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

export default function Dashboard() {
  const [batch, setBatch] = useState([]);
  const [graphedBatch, setGraphedBatch] = useState([]);
  const [count, setCount] = useState(0);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const search = searchParams.get("search");

  useEffect(() => {
    getData(page, search);
  }, [page, search]);

  const getData = async (p, search) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/batch?page=${p}&search=${search}`);
      if (!res.ok) return message.error("Failed to fetch data");
      const data = await res.json();

      let results = [];

      data.allBatch.forEach((item) => {
        results.push({
          value: item.WTDose,
          TimeStamp: new Date(item.TimeStamp).toLocaleString(),
          type: "WTDose",
        });

        results.push({
          value: item.CLDose,
          TimeStamp: new Date(item.TimeStamp).toLocaleString(),
          type: "CLDose",
        });
      });

      setGraphedBatch(results);
      setBatch(data.allBatch);
      setCount(data.count);
      setLatest(data.latest);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
    },
    {
      title: "WTDose",
      dataIndex: "WTDose",
      key: "WTDose",
    },
    {
      title: "CLDose",
      dataIndex: "CLDose",
      key: "CLDose",
    },
    {
      title: "TimeStamp",
      dataIndex: "TimeStamp",
      key: "TimeStamp",
      render: (_, record) => new Date(record.TimeStamp).toLocaleString(),
    },
  ];

  const config = {
    isStack: true,
    xField: "value",
    yField: "TimeStamp",
    seriesField: "type",
    label: {
      position: "middle",
      layout: [{ type: "interval-adjust-position" }, { type: "interval-hide-overlap" }, { type: "adjust-color" }],
    },
  };

  const configColumn = {
    xField: "type",
    yField: "value",
    label: { position: "middle", style: { fill: "#FFFFFF", opacity: 0.6 } },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    meta: { type: { alias: "类别" }, sales: { alias: "销售额" } },
  };

  return (
    <main className="full">
      <Container className="w-100">
        <Row style={{ height: "95vh" }}>
          <Col lg={6}>
            <div className="item-container">
              <h3>
                Latest Batch <span className="small">({new Date(latest?.TimeStamp).toLocaleString()})</span>
              </h3>

              <Row className="mb-5">
                <Col lg={6}>
                  <Card size="small" title="WTDose">
                    {latest?.WTDose || "No Data Yet"}
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card size="small" title="CLDose">
                    {latest?.CLDose || "No Data Yet"}
                  </Card>
                </Col>
              </Row>

              <Column
                {...configColumn}
                data={[
                  { type: "WTDose", value: latest?.WTDose },
                  { type: "CLDose", value: latest?.CLDose },
                ]}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="item-container">
              <h3>Batch Data</h3>

              <Bar {...config} data={graphedBatch} />

              <PaginatedTable loading={loading} columns={columns} dataSource={batch} total={count} />
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
