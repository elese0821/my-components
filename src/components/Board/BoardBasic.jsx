import { useOutletContext } from 'react-router-dom';
import Button from '../common/forms/Button';

export default function BoardBasic() {
    const { list, handleDeleteBoard } = useOutletContext();
    return (
        <div>
            <ul className='flex flex-col gap-4'>
                {list.map((item, index) => (
                    <li key={index} className='p-2 border border-gray-300 rounded-lg flex justify-between'>
                        <div>
                            {item.title}
                        </div>
                        <Button className="mx-0"
                            onClick={() => handleDeleteBoard(item.boardIdx)
                            }
                        >삭제</Button>
                    </li>
                ))}
            </ul>
        </div >
    );
}