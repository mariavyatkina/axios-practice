import React, {useState, useEffect} from 'react';
import './App.css';
import axios, {CancelTokenSource} from 'axios';

interface IPost{
  id: number;
  userId?: number;
  title: string;
  body: string;
}

const defaultPosts: IPost[] = [];

function App() {

  const [posts, setPosts]: [IPost[], (posts: IPost[]) => void] = React.useState(defaultPosts);
  const[loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
  const[error, setError]: [string, (error: string) => void] = React.useState("");
  const cancelToken = axios.CancelToken;
  const[cancelTokenSource, setCancelTokenSource]: [CancelTokenSource, (cancelToken: CancelTokenSource) => void] = React.useState(cancelToken.source());

  const handleCancelClick = () => {
    if(cancelTokenSource){
      cancelTokenSource.cancel("User canceled operation");
    }
  }
  React.useEffect(() => {
    // TODO: get posts
    axios
      .get<IPost[]>("https://jsonplaceholder.typicode.com/posts",{
        cancelToken : cancelTokenSource.token,
        headers: {
          "Content-Type": "application/json"
        }, 
        timeout: 1
      })
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(ex => {
        const error = axios.isCancel(ex)
        ? "Request Cancelled"
        :ex.code ==="ECONNABORTED" 
        ? "A timeout occurred" 
        :ex.response.status === 404 
        ? "Resource Not Found" 
        : "An unexpected error occurred";
        setError(error);
        setLoading(false);
      });
      cancelTokenSource.cancel("User cancelled operation");
  }, [])
  return (
    <div className="App">
      {loading && (<button onClick={handleCancelClick}>Cancel</button>)}
      <ul className="posts">
        {posts.map(post => (
          <li key ={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
