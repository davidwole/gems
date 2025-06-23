import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getEnrollmentFormsByUser } from "../services/api";

export default function ReviewChildData() {
  const { user, token } = useContext(AuthContext);
  const [enrollmentForms, setEnrollmentForms] = useState([]);

  const fetchData = async () => {
    const form = await getEnrollmentFormsByUser(token);
    console.log(form);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Review data</h1>
      {enrollmentForms.length < 0 && (
        <div>
          <h1>You have not filled in an enrollment form</h1>
        </div>
      )}
    </div>
  );
}
