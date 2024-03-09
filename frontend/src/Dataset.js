import React, { useEffect, useState } from "react";
import { DataGridPremium, GridToolbar } from "@mui/x-data-grid-premium";
import { findApi, countApi } from "./common/Api";

export default function AggregationFiltering() {
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [filter, setFilter] = useState([]);
  const [limit, setLimit] = useState(25);
  const [count, setCount] = useState(20);
  const [loading, setLoading] = useState(false);

  const findRecords = async (payload) => {
    setLoading(true);
    const { records = [] } = await findApi(payload);
    setData(records);
    setLoading(false);
  };

  const countRecords = async (payload) => {
    const { count = 0 } = await countApi(payload);
    setCount(count);
  };

  const search = async () => {
    const payload = { filter, skip, limit };
    findRecords(payload);
    countRecords(payload);
  };

  useEffect(() => {
    search();
  }, [skip, limit, filter]);

  const onFilterModelChange = (e) => setFilter(e?.items || []);

  const onPaginationModelChange = (e) => {
    const { pageSize, page } = e;
    const skip = pageSize * page;
    setLimit(pageSize);
    setSkip(skip);
  };

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGridPremium
        rows={data}
        loading={loading}
        columns={COLUMNS}
        getRowId={(row) => row._id}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={(row) => 100}
        pageSizeOptions={[5, 25, 50, 100]}
        pagination={true}
        onPaginationModelChange={onPaginationModelChange}
        rowCount={count || 0}
        paginationMode="server"
        initialState={{
          aggregation: {
            model: {
              gross: "max",
            },
          },
          filter: {
            // filterModel: {
            //    items: [
            //     { field: "creation_date", operator: "equals", value: new Date() }],
            // },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        filterMode="server"
        onFilterModelChange={onFilterModelChange}
        aggregationRowsScope="all"
      />
    </div>
  );
}
const getDetailPanelContent = ({ row = {} }) => {
  return (
    <>
      <div>Row ID: {row?._id || ""}</div>
      <div>business_email: {row?.business_email || ""}</div>
      <div>channel_link: {row?.channel_link || ""}</div>
      <div>channel_name: {row?.channel_name || ""}</div>
      <div>description: {row?.description || ""}</div>
      <div>monetization: {row?.monetization || ""}</div>
      <div>social_links: {row?.social_links || ""}</div>
      <div>subscribers: {row?.subscribers || ""}</div>
      <div>tags: {row?.tags}</div>
      <div>creation_date: {row?.creation_date}</div>
      <div>total_views: {row?.total_views}</div>
      <div>email: {row?.email}</div>
      <div>monetization: {row?.monetization}</div>
      <div>location: {row?.location}</div>
      <div>description: {row?.description}</div>
    </>
  );
};

var COLUMNS = [
  {
    headerName: "Channel Name",
    field: "channel_name",
    width: 200,
    groupable: false,
  },
  {
    headerName: "Creation Date",
    field: "creation_date",
    width: 200,
    groupable: false,
    type: "Date",
  },
  {
    headerName: "Total Views",
    field: "total_views",
    width: 200,
    groupable: false,
    type: "number",
  },
  {
    headerName: "Business Email",
    field: "business_email",
    width: 200,
    groupable: false,
  },
  {
    headerName: "Channel Link",
    field: "channel_link",
    width: 400,
    groupable: false,
  },
  {
    headerName: "Social Link",
    field: "social_links",
    width: 200,
    groupable: false,
  },
  {
    headerName: "Email",
    field: "email",
    width: 200,
    groupable: false,
  },
  {
    headerName: "Subscribers",
    field: "subscribers",
    width: 200,
    groupable: false,
  },
  {
    headerName: "Monetization",
    field: "monetization",
    width: 200,
    groupable: false,
  },
  {
    headerName: "location",
    field: "location",
    width: 200,
    groupable: false,
  },
  {
    headerName: "Old Id",
    field: "oldid",
    width: 200,
    groupable: false,
  },
  {
    headerName: "Tags",
    field: "Tags",
    width: 200,
    groupable: false,
  },
  {
    headerName: "description",
    field: "description",
    width: 200,
    groupable: false,
  },
];
