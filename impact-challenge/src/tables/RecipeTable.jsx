import React, { useEffect, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender
  } from '@tanstack/react-table'
import axios from 'axios';
import './styles.css'



function RecipeTable(props) {

    

    const [data, setData] = useState([]) 
    const [savedPrices, setSavedPrices ] = useState([])
    const tableHeight = window.innerHeight * 0.7;
    const [sortedColumnName, setSortedColumnName] = useState('')

    useEffect(() => {
        axios.get(props.url)
            .then(res => {
                setData(res.data);
                if(localStorage.getItem(props.url) === null){
                    res.data.forEach(item => {savedPrices[item.id] = item.price})
                    setSavedPrices([...savedPrices]);
                }
                else{
                    const newPrices = JSON.parse(localStorage.getItem(props.url))
                    setSavedPrices(newPrices)
                }
                
            })
    }, [])

    useEffect(() => {console.log(savedPrices)}, [savedPrices])

    

    const columnHelper = createColumnHelper();

    const sortData = (columnName) => {
        const sortedData = [...data]
        if(columnName == 'price')
            sortedData.sort((a, b) => savedPrices[a.id] - savedPrices[b.id])
        else
            sortedData.sort((a,b) => (a[columnName] < b[columnName]) ? -1 : 1)
        setData(sortedData)
        setSortedColumnName(columnName)
    }

    const handlePriceChange = (e) => {
        savedPrices[e.target.name] = e.target.value
        setSavedPrices([...savedPrices])
    }

    const savePriceChanges = () => {
        localStorage.setItem(props.url, JSON.stringify(savedPrices))
    }

    const resetPriceChanges = () => {
        data.forEach(item => savedPrices[item.id] = item.price)
        setSavedPrices([...savedPrices])
        localStorage.setItem(props.url, JSON.stringify(savedPrices))
    }

    
    const columns = [
        columnHelper.accessor('id', {
            header: 'ID ',
            footer: info => info.column.id,
          }),
        columnHelper.accessor('name', {
            header: 'Name',
            footer: info => info.column.id,
          }),
        columnHelper.accessor('image', {
            header: 'IMAGE',
            footer: info => info.column.id,
            cell: (props) =>  <img src={props.getValue()} width='30px' height='30px'/>
        }),
        columnHelper.accessor('category', {
            header: 'Category',
            footer: info => info.column.id,
        }),
        columnHelper.accessor('price', {
            header: 'Price',
            footer: info => info.column.id,
            cell: (props) =>  {return <></>}
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            footer: info => info.column.id,
        }),
    ]
    
    const table = useReactTable({columns:columns, data : data, getCoreRowModel: getCoreRowModel(), })
    

    return (
        <div>
        <div style={{height : `${tableHeight}px` , overflowY : 'scroll', width: '85%', marginLeft: 'auto', marginRight : 'auto'}}>
            <table>
                <thead>
                    <tr>
                        {table.getFlatHeaders().map(header => <td  key={header.id} name={header.id} style={header.id === sortedColumnName ?  {backgroundColor: 'skyblue'} : {}} onClick={() => sortData(header.id)}>{header.id}</td>) }
                    </tr>
                </thead>
                <tbody>
                        {table.getRowModel().rows.map(row => { 
                            return <tr key={row.id}>
                            {row.getAllCells().map(cell => {
                                // console.log(cell.row.original.id)
                                if(cell.column.id !== 'price')
                                    return <td key={cell.id}> {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext())} </td>
                                
                                return <td><input type='text' name={cell.row.original.id}
                                                 value={savedPrices[cell.row.original.id]} 
                                                 onChange={handlePriceChange} /></td>
                            })}
                        </tr>}) }
                </tbody>
            </table>
        </div>
        <div>
            <button onClick={savePriceChanges}>Save</button>
            <button onClick={resetPriceChanges}>Reset</button>
        </div>
        </div>
    );
}

export default RecipeTable;