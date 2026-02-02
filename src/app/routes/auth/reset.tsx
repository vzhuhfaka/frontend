import { useNavigate, useSearchParams } from "react-router";

import { AuthLayout } from "@/components/layouts/auth-layout";
import { paths } from "@/config/paths";
import { ResetForm } from "@/features/auth/components/reset-form";

const ResetRoute = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo");

    return (
        <AuthLayout title="Reset your password">
            <ResetForm
                onSuccess={() => {
                    navigate(`${redirectTo ? `${redirectTo}` : paths.app.spases.getHref()}`, {
                        replace: true,
                    });
                }}
            />
        </AuthLayout>
    );
};

export default ResetRoute;
