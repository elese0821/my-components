import styles from './Footer.module.scss';

const Footer = () => {
    return (
        <footer id={styles.footer} role='contentinfo'>
            <a href='mailto:elese0821@naver.com' rel='noopenner noreferrer'>
                elese0821@naver.com
            </a>
        </footer>
    )
}

export default Footer