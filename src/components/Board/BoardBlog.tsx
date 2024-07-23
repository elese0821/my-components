import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MorePopup from './MorePopup';
import useUserStore from '../../stores/userStore';
import Collapse from '@mui/material/Collapse';
import CardActions from '@mui/material/CardActions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ContextType } from '../../pages/board/@types/types';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

export default function BoardBlog() {
    const [expanded, setExpanded] = React.useState(false);
    const { list, handleBoardData } = useOutletContext<ContextType>();
    const [openPopupIndex, setOpenPopupIndex] = React.useState(null);
    const { usrIdx } = useUserStore();
    const popupRef = useRef(null);
    const popupListRef = useRef(null);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleClick = (index) => {
        setOpenPopupIndex(openPopupIndex === index ? null : index);
    };

    const handleClickOutside = (event) => {
        // Open popup list가 아닌 영역을 클릭하면 팝업을 닫음
        if (popupRef.current !== null && !popupRef.current.contains(event.target) && popupListRef.current !== null && !popupListRef.current.contains(event.target)
        ) {
            setOpenPopupIndex(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='grid md:grid-cols-2 lg:grid-cols-1 gap-2'>
            {list.map((el, index) => (
                <Card key={el.boardIdx} className='relative'>
                    <CardHeader
                        action={
                            <IconButton aria-label="settings"
                                onClick={() => handleClick(index)}
                            >
                                <MoreVertIcon />
                                <MorePopup
                                    isOpen={openPopupIndex === index}
                                    onClose={() => setOpenPopupIndex(null)}
                                    usrIdx={usrIdx}
                                    item={el}
                                    handleBoardData={handleBoardData}
                                />
                            </IconButton>
                        }
                        title={el.title}
                        ref={popupRef}
                        // subheader={` ${el.usrNm} | ${el.regDt}`}
                        className='border-b border-gray4'
                    />
                    <CardContent className='min-h-[20vh]'>
                        <div
                            className=' p-4'
                            dangerouslySetInnerHTML={{ __html: el.contents }}
                        />
                        <Typography variant="body2" color="text.secondary" className='absolute top-4 right-10'>
                            <div className='flex flex-col text-right'>
                                <span className='block'>{el.usrNm}</span>
                                <span className='block'>{el.regDt}</span>
                            </div>
                        </Typography>
                    </CardContent>
                </Card>
            ))}


        </div>
    )
}
