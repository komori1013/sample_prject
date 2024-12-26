import { Link } from 'react-router-dom';

const MemberOnly = () => {
  
    // return <>
    //   ログインしていません
    //   <Link to='/login'>Login</Link>
    // </>
    //}

  return (
    <div>
      <h1>MemberOnly</h1>
      <>
      {/*<p>ログイン中のアカウント名：{account_name}</p>
      <p>ログイン中のパスワード名：{password}</p>}*/}
      </>
      <Link to='/'>Home</Link>
    </div>
  )
}

export default MemberOnly;
