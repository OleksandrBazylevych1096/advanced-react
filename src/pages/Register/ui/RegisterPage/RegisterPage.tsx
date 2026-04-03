import {AppPage} from "@/shared/ui/AppPage";

import {RegisterFlowProvider} from "../RegisterFlowProvider/RegisterFlowProvider";

import styles from "./RegisterPage.module.scss";
import {RegisterPageContent} from "./RegisterPageContent";

const RegisterPage = () => {
    return (
        <AppPage className={styles.wrapper}>
            <RegisterFlowProvider>
                <RegisterPageContent />
            </RegisterFlowProvider>
        </AppPage>
    );
};

export default RegisterPage;
