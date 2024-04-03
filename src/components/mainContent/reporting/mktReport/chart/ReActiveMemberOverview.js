import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Label, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StringHelper from 'helpers/StringHelper';

export default function ReActiveMemberOverview({ ...props }) {
  return (
    <ResponsiveContainer width="100%" aspect={1}>
      <BarChart data={props.data ?? []}>
        <XAxis dataKey="title" />
        <YAxis tickFormatter={(value) => StringHelper.formatValue(value)} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          formatter={(value) => {
            return StringHelper.formatValue(value);
          }}
        />
        <Legend />
        <Bar dataKey="member" fill="#8884d8" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
