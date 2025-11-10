import axios from "axios";
import { toast } from "react-toastify";

// Khởi tạo đối tượng axios (authorizedAxiosInstance) mục đích custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()
// Thời gian phản hồi tối đa của 1 req : 10phut

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials : Sẽ cho phép axios tự động gửi cookie trong mỗi request  lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens) vào https Only Cookie của trình duyệt
authorizedAxiosInstance.defaults.withCredentials = true




// Add a request interceptor : can thiệp vào request api
authorizedAxiosInstance.interceptors.request.use( (config) => {
    // Do something before request is sent
    return config;
  },  (error) => {
    // Do something with request error
    return Promise.reject(error);
  },
  { synchronous: true, runWhen: () =>{} /* This function returns true */
    
  }
);

// Add a response interceptor : can thiệp vào response api
authorizedAxiosInstance.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log(response)

    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Xử lí tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây
    //conslole.log(error) là biết cấu trúc của nó

    let errorMessage = error.message
    if(error?.response?.data?.message){
      errorMessage = error?.response?.data?.message
    }

    if(error?.response?.status !== 410){
      toast.error(errorMessage)

      return 
    }

    return Promise.reject(error);
    
  });

export default authorizedAxiosInstance;