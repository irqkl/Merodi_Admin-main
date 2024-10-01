'use client'

import { Table, TableColumnsType, TableProps } from 'antd';
import styles from './Table.module.scss';
import React, { Key, useEffect, useState } from 'react';
import Image from 'next/image';
import './Table.css'

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType { };

interface Props {
    isUserInfo?: boolean;
    columns: TableColumnsType;
    dataSource: DataType[];
    onChoosenItemsClick?: (choosenItemsKeys: React.Key[],) => void;
};

const AntTable = (props: Props) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const onChoosenItemsAction = () => {
        setSelectedRowKeys([]);
        if (props.onChoosenItemsClick) {
            props.onChoosenItemsClick(selectedRowKeys)
        }
    }

    const rowSelection: TableRowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const columns: TableColumnsType = props.columns?.map((item) => (
        item
    ));
    columns.push(
        { title: '', dataIndex: 'edit', width: 16, },
        {
            title: props.isUserInfo ?
                <Image src={'/icons/blockIcon.svg'} alt='trash' width={24} height={24} onClick={onChoosenItemsAction} /> :
                <Image src={'/icons/trash.svg'} alt='trash' width={24} height={24} onClick={onChoosenItemsAction} />, dataIndex: 'action', width: 24
        },
    )

    return <div className={styles.container}>
        <Table className={styles.table} rowSelection={rowSelection} columns={columns} dataSource={props.dataSource} pagination={{
            position: ['bottomLeft']
        }} />
    </div>
}

export default AntTable;