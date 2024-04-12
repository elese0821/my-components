import { Link, Route, Routes } from 'react-router-dom'
import BasicTable from './TableCate/BasicTable'
import SelectTable from './TableCate/SelectTable'

const Table = () => {
    return (
        <div>
            <ul>
                <li><Link to='/table'>Basic Table</Link></li>
                <li><Link to='/table/selectTable'>Select table Table</Link></li>
            </ul>

            <Routes>
                <Route path='/' element={<BasicTable />} />
                <Route path='selectTable' element={<SelectTable />} />
            </Routes>
        </div>
    )
}
export default Table