import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

function Register() {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://192.168.100.99:5050/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.accessToken); // ✅ Tokenni to‘g‘ri saqlash
        localStorage.setItem("userId", data.user._id); // ✅ User ID saqlash
        navigate("/profile"); // ✅ Profil sahifasiga yo‘naltirish
        window.location.reload(); // 🔄 Sahifani yangilab, tokenni ishlatish
      } else {
        setError(data.message || "Registration failed!");
      }
    } catch (err) {
      setError("Server error!");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Create an Account</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component="button" onClick={() => navigate("/profile")}>
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && <Text color="red">{error}</Text>}

        <TextInput
          label={<Text style={{ color: "#000", fontWeight: "bold" }}>Fullname</Text>}
          placeholder="Enter your full name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
        <TextInput
           label={<Text style={{ color: "#000", fontWeight: "bold" }}>Email</Text>}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
           label={<Text style={{ color: "#000", fontWeight: "bold" }}>Password</Text>}
          placeholder="Enter a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt="md"
        />
        <PasswordInput
           label={<Text style={{ color: "#000", fontWeight: "bold" }}>Coniform password</Text>}
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          mt="md"
        />

        <Button fullWidth mt="xl" onClick={handleRegister}>
          Register
        </Button>
      </Paper>
    </Container>
  );
}

export default Register;
