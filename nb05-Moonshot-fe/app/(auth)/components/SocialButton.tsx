"use client";

import classNames from "classnames/bind";
import KakaoImage from "@/assets/kakao.png";
import GoogleImage from "@/assets/google.png";
import NaverImage from "@/assets/naver.png";
import FacebookImage from "@/assets/facebook.png";
import OAuthProvider from "@/types/OAuthProivder";
import styles from "./SocialButton.module.css";
import Image from "next/image";
const cx = classNames.bind(styles);

const SOCIAL_BUTTON_IMAGE_MAP = {
  [OAuthProvider.GOOGLE]: GoogleImage,
  [OAuthProvider.KAKAO]: KakaoImage,
  [OAuthProvider.NAVER]: NaverImage,
  [OAuthProvider.FACEBOOK]: FacebookImage,
};

const SocialButton = ({ provider }: { provider: OAuthProvider }) => {
  const handleClick = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    if (provider === OAuthProvider.GOOGLE) {
      window.location.href = `${baseUrl}/auth/google`;
    } else {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const oauth_url = `${baseUrl}/auth/oauth2/${provider}?redirectUri=${encodeURIComponent(redirectUri)}`;
      window.location.href = oauth_url;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cx(styles.socialButton, provider)}
      aria-label={`${provider} 로그인`}
    >
      <Image
        className={cx(styles.socialButtonImage)}
        src={SOCIAL_BUTTON_IMAGE_MAP[provider]}
        alt={provider}
      />
    </button>
  );
};

export default SocialButton;
