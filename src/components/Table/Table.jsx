import { Link, Route, Routes } from 'react-router-dom'
import BasicTable from './TableCate/BasicTable'
import SelectTable from './TableCate/SelectTable'
import EtcTable from './TableCate/EtcTable'

const Table = () => {
    return (
        <div>
            <ul>
                <li><Link to='/table'>Basic Table</Link></li>
                <li><Link to='/table/selectTable'>Select Table</Link></li>
                <li><Link to='/table/etcTable'>etc Table</Link></li>
            </ul>

            <Routes>
                <Route path='/' element={<BasicTable />} />
                <Route path='selectTable' element={<SelectTable />} />
                <Route path='etcTable' element={<EtcTable />} />
            </Routes>
        </div>
    )
}
export default Table