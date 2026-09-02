import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import api from "../../api/axios";
import type { Organisation } from "../../utils/types";

function Home() {
  const { user } = useUserContext();

  const [organisation, setOrganisation] = useState<
    Organisation | null | undefined
  >(undefined);
  const [name, setName] = useState<string>("");
  const [joinLink, setJoinLink] = useState<string>("");

  useEffect(() => {
    const getOrg = async () => {
      try {
        const res = await api.get("/api/organisation/");
        const organisationData = res.data.organisation;

        if (organisation === null) {
          setOrganisation(null);
          setJoinLink("");
          return;
        }

        console.log(res);
        setOrganisation(organisationData);
        setJoinLink(`${window.location.origin}/join/${res.data.join_token}`);
      } catch (error) {
        alert(error);
      }
    };
    getOrg();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/organisation/", { name });
      const createdOrg = res.data;
      console.log(res);

      setOrganisation(createdOrg);
      setJoinLink(`${window.location.origin}/join/${createdOrg.join_token}`);
      setName("");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      {user?.organisation === null ? (
        <form onSubmit={handleSubmit}>
          <h1>Create Organisation</h1>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Organisation"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="submit">Create</button>
        </form>
      ) : user?.type === "admin" ? (
        <div>
          <h1>{user.organisation_name}</h1>
          <label htmlFor="link"></label>
          <input readOnly id="link" type="text" value={joinLink} />
        </div>
      ) : (
        <div>
          <h1>{user?.organisation_name}</h1>
          <p>
            Welcome {user?.first_name} {user?.last_name}
          </p>
          <p>Email: {user?.email}</p>
          <p>Type: {user?.type}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
