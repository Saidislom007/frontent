import React from "react";
import ReactDOM from "react-dom/client";
  // ✅ MantineProvider qo‘shildi
const App = React.lazy(() => import("./components/app/App.jsx"))
import { StrictMode} from "react";


ReactDOM.createRoot(document.getElementById("root")).render(

    <StrictMode>
        <App/>
    </StrictMode>
    

);



