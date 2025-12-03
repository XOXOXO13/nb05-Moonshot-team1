"use client";

import classNames from "classnames/bind";
import { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Input from "@/nb05-Moonshot-fe/shared/components/Input";
import Button from "@/nb05-Moonshot-fe/shared/components/Button";
import ImageInput from "@/nb05-Moonshot-fe/shared/components/ImageInput";
import Label from "@/nb05-Moonshot-fe/shared/components/Label";
import OAuthProvider from "@/nb05-Moonshot-team1/types/OAuthProivder";
import SocialButton from "../components/SocialButton";
import styles from "../shared.module.css";
import { register, RegisterInput } from "./actions";

const cx = classNames.bind(styles);

type FormState = Omit<RegisterInput, "profileImage">;

const RegisterPage = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [state, dispatch, isPending] = useActionState(
    async (_: FormState, payload: FormData) => {
      const formValues: FormState = {
        email: payload.get("email") as string,
        password: payload.get("password") as string,
        name: payload.get("name") as string,
        passwordConfirm: payload.get("passwordConfirm") as string,
      };

      const result = await register({
        ...formValues,
        profileImage,
      });

      if (result.success) {
        toast.success(result.success);
        router.push("/login");
      } else if (result.error) {
        toast.error(result.error);
      }

      return formValues;
    },
    {
      email: "",
      password: "",
      name: "",
      passwordConfirm: "",
    }
  );

  return (
    <div className={cx(styles.container)}>
      <h1 className={cx(styles.title)}>회원가입</h1>
      <form className={cx(styles.form)} action={dispatch}>
        <div className={cx(styles.inputContainer)}>
          <Label>프로필 이미지</Label>
          <ImageInput url={profileImage} onChange={setProfileImage} />
        </div>
        <div className={cx(styles.inputContainer)}>
          <Label>이메일</Label>
          <Input
            type="email"
            name="email"
            defaultValue={state.email}
            placeholder="example@email.com"
            required
          />
        </div>
        <div className={cx(styles.inputContainer)}>
          <Label>닉네임</Label>
          <Input
            type="text"
            name="name"
            defaultValue={state.name}
            placeholder="닉네임"
            required
          />
        </div>
        <div className={cx(styles.inputContainer)}>
          <Label>비밀번호</Label>
          <Input
            type="password"
            name="password"
            defaultValue={state.password}
            placeholder="8자리 이상"
            required
            minLength={8}
          />
        </div>

        <div className={cx(styles.inputContainer)}>
          <Label>비밀번호 확인</Label>
          <Input
            type="password"
            name="passwordConfirm"
            defaultValue={state.passwordConfirm}
            placeholder="비밀번호 확인"
            required
            minLength={8}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          회원가입
        </Button>
      </form>

      <div className={cx(styles.loginLinkContainer)}>
        이미 가입하셨나요? <Link href="/login">로그인하기</Link>
      </div>

      <div className={cx(styles.socialLoginContainer)}>
        <p className={cx(styles.socialButtonTitle)}>SNS 간편 로그인</p>
        <div className={cx(styles.socialButtonContainer)}>
          <SocialButton provider={OAuthProvider.NAVER} />
          <SocialButton provider={OAuthProvider.GOOGLE} />
          <SocialButton provider={OAuthProvider.FACEBOOK} />
          <SocialButton provider={OAuthProvider.KAKAO} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
