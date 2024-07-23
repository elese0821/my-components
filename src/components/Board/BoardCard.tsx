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
import { ContextType } from './../../pages/board/@types/types.d';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function BoardCard() {
    const [expanded, setExpanded] = React.useState(false);
    const { list, handleBoardData } = useOutletContext<ContextType>();
    const [openPopupIndex, setOpenPopupIndex] = React.useState(null);
    const { usrIdx } = useUserStore();
    const popupRef = useRef(null);
    const popupListRef = useRef(null);

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
        <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-2'>
            {list.map((item, index) => (
                <Card key={item.boardIdx} >
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
                                    item={item}
                                    handleBoardData={handleBoardData}
                                />
                            </IconButton>
                        }
                        title={item.title}
                        ref={popupRef}
                    // subheader={regDt}
                    />

                    {/* <CardMedia
                        component="img"
                        height="194"
                        image="/static/images/cards/paella.jpg"
                        alt="Paella dish"
                    /> */}
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {item.usrNm} | {item.regDt}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            조회수 : {item.views === null && 1}
                        </Typography>
                    </CardContent>
                </Card>
            ))}


        </div>
    )
}
