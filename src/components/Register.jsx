import { useState } from "react";
import Swal from "sweetalert2";
import { Avatar, Box, Button, Container, CssBaseline, Grid, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const defaultTheme = createTheme();

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        cpassword: ""
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";
        if (!formData.phone) tempErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone)) tempErrors.phone = "Invalid phone number (10 digits required)";
        if (!formData.username) tempErrors.username = "Username is required";
        if (!formData.password) tempErrors.password = "Password is required";
        else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
        if (!formData.cpassword) tempErrors.cpassword = "Confirm Password is required";
        else if (formData.password !== formData.cpassword) tempErrors.cpassword = "Passwords do not match";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            Swal.fire("Error!", "Please fix the errors in the form before submitting.", "error");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("Success!", result.message, "success");
                setFormData({ name: "", email: "", phone: "", username: "", password: "", cpassword: "" });
            } else {
                Swal.fire("Error!", result.detail || "Something went wrong.", "error");
            }
        } catch (error) {
            Swal.fire("Network Error!", "Failed to connect to the server.", "error");
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" className='h-[100vh]'>
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">Join as Employee</Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField name="name" fullWidth label="Name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="email" fullWidth label="Email Address" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="phone" fullWidth label="Phone Number" value={formData.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="username" fullWidth label="Username" value={formData.username} onChange={handleChange} error={!!errors.username} helperText={errors.username} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="password" fullWidth label="Password" type="password" value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="cpassword" fullWidth label="Confirm Password" type="password" value={formData.cpassword} onChange={handleChange} error={!!errors.cpassword} helperText={errors.cpassword} />
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Create Account</Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
