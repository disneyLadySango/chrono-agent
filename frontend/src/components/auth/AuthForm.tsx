"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";

interface AuthFormProps {
  view?: "sign_in" | "sign_up" | "forgotten_password";
  redirectTo?: string;
}

export function AuthForm({
  view = "sign_in",
  redirectTo = "/",
}: AuthFormProps) {
  return (
    <Auth
      supabaseClient={supabase}
      view={view}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: "#18181b",
              brandAccent: "#27272a",
              brandButtonText: "#ffffff",
              inputText: "#18181b",
              inputBackground: "#ffffff",
              inputBorder: "#e4e4e7",
              inputBorderFocus: "#18181b",
              inputBorderHover: "#a1a1aa",
            },
            borderWidths: {
              buttonBorderWidth: "1px",
              inputBorderWidth: "1px",
            },
            radii: {
              borderRadiusButton: "0.5rem",
              buttonBorderRadius: "0.5rem",
              inputBorderRadius: "0.5rem",
            },
          },
        },
        className: {
          container: "w-full",
          button: "font-medium",
          input: "text-sm",
          label: "text-sm font-medium",
        },
      }}
      localization={{
        variables: {
          sign_in: {
            email_label: "メールアドレス",
            password_label: "パスワード",
            button_label: "ログイン",
            loading_button_label: "ログイン中...",
            link_text: "アカウントをお持ちですか？ログイン",
            email_input_placeholder: "メールアドレスを入力",
            password_input_placeholder: "パスワードを入力",
          },
          sign_up: {
            email_label: "メールアドレス",
            password_label: "パスワード",
            button_label: "アカウント作成",
            loading_button_label: "作成中...",
            link_text: "アカウントをお持ちでない方はこちら",
            email_input_placeholder: "メールアドレスを入力",
            password_input_placeholder: "パスワードを入力",
          },
          forgotten_password: {
            email_label: "メールアドレス",
            button_label: "パスワードリセットメールを送信",
            loading_button_label: "送信中...",
            link_text: "パスワードを忘れた方",
            email_input_placeholder: "メールアドレスを入力",
          },
        },
      }}
      providers={[]}
      redirectTo={redirectTo}
      showLinks={true}
    />
  );
}
