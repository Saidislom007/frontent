// import { Component } from "react";
// import axios from "axios";

// const api = axios.create({
//   baseURL: `http://127.0.0.1:8000/ru/contact/api/`
// });

// class Contact extends Component {
//   state = {
//     contacts: []
//   };

  // componentDidMount() {
  //   this.getContact();
  // }

  // getContact = async () => {
  //   try {
  //     let { data } = await api.get("/");
  //     this.setState({ contacts: data });
  //   } catch (error) {
  //     console.error("Xatolik yuz berdi:", error);
  //   }
  // };

//   createContact = async () => {
//     try {
//       let res = await api.post("/", {
//         id: 67,
//         name: "Olim",
//         email: "olimjon@gmail.com",
//         message: "Salom, qalesan?"
//       });
//       console.log(res);
//       this.getContact(); // Yangilash uchun
//     } catch (error) {
//       console.error("Kontakt qo‘shishda xatolik:", error);
//     }
//   };

//   deleteContact = async (id) => {
//     try {
//       await api.delete(`/${id}`);
//       this.getContact(); // O'chirilgandan keyin listni yangilash
//     } catch (error) {
//       console.error("O‘chirishda xatolik:", error);
//     }
//   };

  

//   render() {
//     return (
      // <div>
      //   <button onClick={this.createContact}>Contact Us</button>
      //   {this.state.contacts.map((contact) => (
      //     <h2 key={contact.id}>
      //       {contact.id}
      //     </h2>
      //   ))}
        
      // </div>
//     );
//   }
// }

// export default Contact;



import { Button, Group, SimpleGrid, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function GetInTouchSimple() {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validate: {
      name: (value) => value.trim().length < 2,
      email: (value) => !/^\S+@\S+$/.test(value),
      subject: (value) => value.trim().length === 0,
    },
  });

  return (
    <form onSubmit={form.onSubmit(() => {})}>
      <Title
        order={2}
        size="h1"
        style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
        fw={900}
        ta="center"
      >
        Contact Page
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
        <TextInput
          label="Name"
          placeholder="Your name"
          name="name"
          variant="filled"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Email"
          placeholder="Your email"
          name="email"
          variant="filled"
          {...form.getInputProps('email')}
        />
      </SimpleGrid>

      <TextInput
        label="Subject"
        placeholder="Subject"
        mt="md"
        name="subject"
        variant="filled"
        {...form.getInputProps('subject')}
      />
      <Textarea
        mt="md"
        label="Message"
        placeholder="Your message"
        maxRows={10}
        minRows={5}
        autosize
        name="message"
        variant="filled"
        {...form.getInputProps('message')}
      />

      <Group justify="center" mt="xl">
        <Button type="submit" size="md">
          Send message
        </Button>
      </Group>
    </form>
  );
}
