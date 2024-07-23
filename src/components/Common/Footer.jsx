import { Typography } from '@material-tailwind/react';
import styles from './Footer.module.scss';

const Footer = () => {
    return (
        // <footer id={styles.footer} role='contentinfo'>
        //     <a href='mailto:elese0821@naver.com' rel='noopenner noreferrer'>
        //         (주)스카이앤드
        //     </a>
        // </footer>
        <Typography
            role='contentinfo'
            id={styles.footer}
            align="center"
            className='text-white'
        >
            {'Copyright © '}
            <a color="inherit" href="https://skyand.co.kr" target='blank'>
                (주)스카이앤드
            </a>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

export default Footer