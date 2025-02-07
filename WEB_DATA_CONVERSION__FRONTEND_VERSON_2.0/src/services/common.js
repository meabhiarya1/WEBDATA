import axios from "axios";
import { toast } from "react-toastify";

// export const SERVER_IP = "http://192.168.1.60:4000";
export const REACT_APP_IP = "localhost";


export const onGetTemplateHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_IP}/get/templetes`,
      {},
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const onGetAllUsersHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_IP}/users/getallusers`,
      {},
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};

export const onGetVerifiedUserHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));
  if (!token) {
    return;
  }
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_IP}/users/getuser`,
      {},
      {
        headers: {
          token: token,
        },
      }
    );

    return response.data;
  } catch (error) { }
};

export const onGetAllTasksHandler = async () => {
  const token = JSON.parse(localStorage.getItem("userData"));

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_IP}/get/alltasks`,
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    // toast.error(error.message);
  }
};

export const onGetTaskHandler = async (id) => {
  const token = JSON.parse(localStorage.getItem("userData"));
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVER_IP}/get/task/${id}`,
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.message);
  }
};



export const fetchFilesAssociatedWithTemplate = async (templateId) => {
  const token = JSON.parse(localStorage.getItem("userData"));

  try {
    const response = await axios.post(`http://${REACT_APP_IP}:4000/getUploadedFiles/${templateId}`,
      {
        headers: {
          token: token, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}