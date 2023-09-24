"use client";
import { Bar, Column } from "@ant-design/charts";
import { Card, Table, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

const { Text, Title } = Typography;

export default function Home() {
  const [batch, setBatch] = useState([]);
  const [graphedBatch, setGraphedBatch] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/batch");
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
      } catch (error) {
        message.error(error.message);
      }
    })();
  }, []);

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
        <Row>
          <Col lg={12} className="text-center">
            <Title className="text-white">Batch Data</Title>
          </Col>
          <Col lg={6}>
            <div className="item-container">
              <Title>
                Latest Data <span className="small">({new Date(batch[0]?.TimeStamp).toLocaleString()})</span>
              </Title>

              <Row className="mb-5">
                <Col lg={6}>
                  <Card size="small" title="WTDose">
                    {batch[0]?.WTDose || "No Data Yet"}
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card size="small" title="CLDose">
                    {batch[0]?.CLDose || "No Data Yet"}
                  </Card>
                </Col>
              </Row>

              <Column
                {...configColumn}
                data={[
                  { type: "WTDose", value: batch[0]?.WTDose },
                  { type: "CLDose", value: batch[0]?.CLDose },
                ]}
              />
            </div>
          </Col>
          <Col lg={6}>
            <div className="item-container">
              <Title>Batch Data</Title>

              <Bar {...config} data={graphedBatch} />

              <Table
                className="mt-5"
                size="small"
                rowKey="_id"
                columns={columns}
                dataSource={batch}
                pagination={{
                  total: batch?.length,
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
