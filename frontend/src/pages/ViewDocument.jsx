import { useEffect, useState } from "react";
import { getDocument } from "../services/api";
import { useParams } from "react-router-dom";

export default function ViewDocument() {
  const [document, setDocument] = useState([]);
  const { id } = useParams();
  const [token, setToken] = useState(localStorage.getItem("token"));

  const getId = async () => {
    const data = await getDocument(id, token);
    setDocument(data.documents[0].url);
  };

  useEffect(() => {
    getId();
  }, []);
  return (
    <div>
      <h1>Id Submitted</h1>
      <img src={document} />
    </div>
  );
}
