import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
  const accesstoken = localStorage.getItem("token");

  if (accesstoken /*|| access_token.indexOf("ok ") < 0*/) {
    return <Navigate replace to="/memberonly" />
  };

  const inputAccountNameRef = useRef<HTMLInputElement>(null);  //useRefで入力したIDをreactのどこかに記録、画面にはレンダーされない
  const inputPasswordRef = useRef<HTMLInputElement>(null);     //useRefで入力したPasswordをreactのどこかに記録、画面にはレンダーされない
  const navigate = useNavigate();                              //useNavigateの引数にURLを渡すと、そのURLに遷移
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onClickHandler = async () => {
    const account_name = inputAccountNameRef.current?.value ?? "";
    const password = inputPasswordRef.current?.value ?? "";

    if (!account_name || !password) {
      setErrorMessage("Please enter your account name and password");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/authentication`, // fetchとは、サーバーと通信するためのグローバル関数で、Promiseを返す。リクエストを送信し、レスポンスを取得するための簡単な方法を提供する
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account_name, password })
        });

      const data = await res.json();
   
      if (!res.ok) {  //ok は Response インターフェイスの読み取り専用プロパティで、このレスポンスが（200-299 で）成功したかどうかを表す論理値です。
        throw new Error(data.error);
    
      }

    } catch (error) {
      setErrorMessage((error as Error).message);
      return;
    };

    try {
      const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/token`, // fetchとは、サーバーと通信するためのグローバル関数で、Promiseを返す。リクエストを送信し、レスポンスを取得するための簡単な方法を提供する
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {  //ok は Response インターフェイスの読み取り専用プロパティで、このレスポンスが（200-299 で）成功したかどうかを表す論理値です。
        throw new Error(verifyData.error);
      }
      // 認証成功時の処理 
      localStorage.setItem("token", verifyData.token);
      navigate('/memberonly');

    } catch (error) {
      setErrorMessage((error as Error).message);
      return;
    };


  };

  return (
    <div>
      <h1>Login</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <input type="text" ref={inputAccountNameRef} placeholder="account_name" />
      <input type="password" ref={inputPasswordRef} placeholder="password" />
      <button onClick={onClickHandler}>Login</button>
    </div>
  );
};

export default Login;
