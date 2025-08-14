import { LoginForm, loginReducer } from "@/features/login";

import { DynamicModuleLoader } from "@/shared/lib";

import styles from "./LoginPage.module.scss";

const LoginPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <h1 className={styles.title}>Sign in</h1>
        <DynamicModuleLoader
          reducers={{ loginForm: loginReducer }}
          removeAfterUnmount
        >
          <LoginForm />
        </DynamicModuleLoader>
      </div>
    </div>
  );
};

export default LoginPage;
