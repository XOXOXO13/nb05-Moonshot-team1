"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classNames from "classnames/bind";
import { toast } from "react-toastify";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import Label from "@/shared/components/Label";
import OAuthProvider from "@/nb05-Moonshot-team1/types/OAuthProivder";
import SocialButton from "../components/SocialButton";
import { login, LoginInput } from "./actions";
import styles from "../shared.module.css";

const cx = classNames.bind(styles);

const LoginPage = () => {
  const router = useRouter();
  const [state, dispatch, isPending] = useActionState(
    async (_: LoginInput, formData: FormData) => {
      const values: LoginInput = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      const result = await login(values);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        router.push("/");
      }

      return values;
    },
    {
      email: "",
      password: "",
    },
  );

  return (
    <div className={cx(styles.container)}>
      <h1 className={cx(styles.title)}>로그인</h1>
      <form className={cx(styles.form)} action={dispatch}>
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
          <Label>비밀번호</Label>
          <Input
            type="password"
            name="password"
            defaultValue={state.password}
            placeholder="비밀 번호"
            required
          />
        </div>

        <Button type="submit" disabled={isPending}>
          로그인
        </Button>
      </form>

      <div className={cx(styles.registerLinkContainer)}>
        Moonshot이 처음이신가요? <Link href="/register">가입하기</Link>
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

export default LoginPage;
