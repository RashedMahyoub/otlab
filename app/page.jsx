/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { USER } from "@/utils/constant";
import { Button, Form, Input, Typography, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";

export default function Home() {
  const router = useRouter();

  const onLogin = async (values) => {
    if (values.email == USER.email && values.password == USER.password) {
      router.push("/dashboard");
    } else {
      message.error("invalid username or password");
    }
  };

  return (
    <main className="full">
      <Container className="w-100">
        <Row style={{ height: "95vh" }}>
          <Col lg={12} className="d-flex justify-content-center align-items-center">
            <div className="p-5 bg-white rounded">
              <Image
                className="mb-3"
                src="/logo.png"
                alt="logo"
                height={200}
                width={300}
                style={{ objectFit: "contain" }}
              />
              <Form className="auth-form" layout="vertical" name="login-form" onFinish={onLogin}>
                <Form.Item label="Email" className="none" name="email" rules={[{ required: true }]}>
                  <Input className="auth-input" />
                </Form.Item>

                <Form.Item label="Password" name="password" className="mb-3 none" rules={[{ required: true }]}>
                  <Input.Password className="auth-input" />
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                  Login
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
