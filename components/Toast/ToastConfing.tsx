import ToastMessage from "./ToastMessage";

export interface ToastConfigPros {
  msg: string;
  icon: React.ReactNode;
}

export const toastConfig = {
  error: ({ props }: { props: ToastConfigPros }) => (
    <ToastMessage
      type="error"
      msg={props.msg}
      icon={props.icon}
    />
  ),
  success: ({ props }: { props: ToastConfigPros }) => (
    <ToastMessage
      type="success"
      msg={props.msg}
      icon={props.icon}
    />
  ),
};

export default toastConfig;
