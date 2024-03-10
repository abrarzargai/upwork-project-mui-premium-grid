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
  { field: 'channel_link', headerName: 'Channel Link',type:'string', width: 150 },
  { field: 'channel_name', headerName: 'Channel Name',type:'string', width: 150 },
  { field: 'creation_date', headerName: 'Creation Date', type:'date',valueFormatter: params => new Date(params?.value).toLocaleString(),width: 150 },
  { field: 'total_views', headerName: 'Total Views',type:'number',valueFormatter: params =>parseInt(params.value), width: 150 },
  { field: 'location', headerName: 'Location',type:'string', width: 150 },
  { field: 'business_email', headerName: 'Business Email',type:'string', width: 150 },
  { field: 'email', headerName: 'Email',type:'string', width: 150 },
  { field: 'description', headerName: 'Description',type:'string', width: 150 },
  { field: 'social_links', headerName: 'Social Links',type:'string', width: 150 },
  { field: 'subscribers', headerName: 'Subscribers',type:'number', width: 150 },
  { field: 'monetization', headerName: 'Monetization',type:'string', width: 150 },
  { field: 'tags', headerName: 'Tags',type:'number' ,width: 150 },
];
