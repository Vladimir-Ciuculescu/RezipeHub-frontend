import ToastMessage from "./ToastMessage";

export interface ToastConfigPros {
  title: string;
  msg: string;
  icon: React.ReactNode;
}

export const toastConfig = {
  error: ({ props }: { props: ToastConfigPros }) => (
    <ToastMessage
      type="error"
      title={props.title}
      msg={props.msg}
      icon={props.icon}
    />
  ),
  success: ({ props }: { props: ToastConfigPros }) => (
    <ToastMessage
      title={props.title}
      type="success"
      msg={props.msg}
      icon={props.icon}
    />
  ),
};

export default toastConfig;
