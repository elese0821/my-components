/**
 * 소셜 프로필 이미지 URL 보정
 *  - 구글(lh3.googleusercontent.com): =s96-c 같은 저해상 크롭 → 고해상으로 교체
 *  - 카카오: 그대로 사용
 */
export function hiResAvatar(url?: string | null, size = 256): string | null {
    if (!url) return null;
    // 구글 이미지: 끝의 =s{N}-c 또는 =s{N} 사이즈 토큰을 키움
    if (url.includes('googleusercontent.com')) {
        if (/=s\d+(-c)?$/.test(url)) return url.replace(/=s\d+(-c)?$/, `=s${size}-c`);
        return `${url}=s${size}-c`;
    }
    return url;
}
