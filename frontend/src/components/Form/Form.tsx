import { useEffect, useState } from "react";
import api from "../../api/axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";
import { useNavigate, useParams } from "react-router";
import { useUserContext } from "../../context/UserContext";

type FormProps = {
  formType: "login" | "baseRegister" | "adminRegister";
  route: string;
};

export function Form({ formType, route }: FormProps) {
  const [firstNameInput, setFirstNameInput] = useState<string>("");
  const [lastNameInput, setLastNameInput] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [_, setOrganisationName] = useState<string>("");

  const navigate = useNavigate();
  const { token } = useParams();

  const { user, setUser } = useUserContext();

  useEffect(() => {
    if (formType !== "baseRegister" || !token) {
      return;
    }

    const getOrganisation = async () => {
      try {
        const res = await api.get(`/api/organisation/join/${token}/`, {
          headers: {
            skipAuth: "true",
          },
        });
        setOrganisationName(res.data.organisation_name);
      } catch {
        alert("Invalid or expired org invite");
      }
    };

    getOrganisation();
  }, [formType, token]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      if (formType === "login") {
        const res = await api.post(route, { email: emailInput, password });

        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        const userRes = await api.get("/api/user/");
        console.log(userRes);
        setUser({
          id: userRes.data.id,
          first_name: userRes.data.first_name,
          last_name: userRes.data.last_name,
          email: userRes.data.email,
          type: userRes.data.role,
          organisation: userRes.data.organisation,
          organisation_name: userRes.data.organisation_name,
        });
        navigate("/");
      } else if (formType === "baseRegister") {
        await api.post(
          "/api/user/join/",
          {
            first_name: firstNameInput,
            last_name: lastNameInput,
            email: emailInput,
            password,
            join_token: token,
          },
          { headers: { skipAuth: "true" } },
        );
        navigate("/login");
      } else {
        await api.post(route, {
          first_name: firstNameInput,
          last_name: lastNameInput,
          email: emailInput,
          password,
          role: "admin",
        });
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>{formType === "login" ? "Login" : "Create Account"}</h1>
        {formType === "baseRegister" ? (
          <p>You have been invited to {user?.organisation}</p>
        ) : null}

        {formType !== "login" ? (
          <div>
            <label htmlFor="fName">First Name</label>
            <input
              id="fName"
              type="text"
              placeholder="First Name"
              value={firstNameInput}
              onChange={(e) => setFirstNameInput(e.target.value)}
            />
            <label htmlFor="lName">Last Name</label>
            <input
              id="lName"
              type="text"
              placeholder="Last Name"
              value={lastNameInput}
              onChange={(e) => setLastNameInput(e.target.value)}
            />
          </div>
        ) : null}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          placeholder="Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          {formType === "login" ? "Login" : "Create Account"}
        </button>
      </form>
      {formType === "login" ? (
        <button onClick={() => navigate("/register")}>Create Account</button>
      ) : null}
    </div>
  );
}
