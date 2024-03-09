import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGridPremium, GridToolbar } from "@mui/x-data-grid-premium";

export default function AggregationFiltering() {
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(25);
  const [count, setCount] = useState(20);
  const [loading, setLoading] = useState(false);

  const search = async (filter = []) => {
    setLoading(true);
    const payload = { filter, skip, limit };
    const { records = [], count = 0 } = await apiCall(payload);
    setData(records);
    setCount(count);
    setLoading(false);

  };

  useEffect(() => {
    search();
  }, [skip, limit]);

  const onFilterModelChange = (e) => search(e?.items || []);
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
            filterModel: {
              items: [{ field: "title", operator: "equals", value: "Titanic" }],
            },
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
const getDetailPanelContent = ({row={}}) => {
  return (
    <>
      <div>Row ID: {row?._id || ''}</div>
      <div>business_email: {row?.business_email || ''}</div>
      <div>channel_link: {row?.channel_link || ''}</div>
      <div>channel_name: {row?.channel_name || ''}</div>
      <div>description: {row?.description || ''}</div>
      <div>monetization: {row?.monetization || ''}</div>
      <div>social_links: {row?.social_links || ''}</div>
      <div>subscribers: {row?.subscribers || ''}</div>
      <div>tags: {row?.tags}</div>

    </>
  );
};
var apiCall = async (payload) => {
  try {
    const response = await axios.post(
      "http://138.201.127.162:8080/api/dataset/search",
      payload
    );
    console.log("response :", response);
    return response?.data;
  } catch (error) {
    console.log("Catch Error : ", error);
    return {}
  }
};

var COLUMNS = [
  {
    headerName: "channel_name",
    field: "channel_name",
    width: 200,
    groupable: false,
  },
  {
    headerName: "creation_date",
    field: "creation_date",
    width: 200,
    groupable: false,
  },
  {
    headerName: "total_views",
    field: "total_views",
    width: 200,
    groupable: false,
  },
  {
    headerName: "business_email",
    field: "business_email",
    width: 200,
    groupable: false,
  },
  {
    headerName: "channel_link",
    field: "channel_link",
    width: 400,
    groupable: false,
  },
];
