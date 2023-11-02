"use client";
import { Input, Table } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const PaginatedTable = ({ rowKey = "_id", columns, dataSource, total, loading, pagination = true }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const onUpdateParams = (title, value) => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    if (!value) {
      current.delete(title);
    } else {
      current.set(title, value);
    }

    // cast to string
    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.replace(`${pathname}${query}`, { shallow: true });
  };

  return (
    <div className="mt-4">
      <Input
        className="mb-2"
        placeholder="filter..."
        onChange={(v) => onUpdateParams("search", v.target.value)}
      />

      <Table
        size="small"
        rowKey={rowKey}
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={
          pagination
            ? {
                showSizeChanger: false,
                pageSize: 5,
                total,
                onChange: (page) => {
                  onUpdateParams("page", page);
                },
              }
            : false
        }
      />
    </div>
  );
};

export default PaginatedTable;
