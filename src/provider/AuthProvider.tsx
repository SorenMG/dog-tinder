import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../initSupabase';
import { Session } from '@supabase/supabase-js';
type ContextProps = {
	user: null | boolean;
	session: Session | null;
};

const AuthContext = createContext<Partial<ContextProps>>({});

interface Props {
	children: React.ReactNode;
}

const AuthProvider = (props: Props) => {
	const [user, setUser] = useState<null | boolean>(null);
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session != null) return
			setSession(session)
			setUser(session ? true : false);
		})
		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
			setUser(session ? true : false);
		})
		return () => {
			authListener.subscription.unsubscribe();
		};
	}, [user]);

	return (
		<AuthContext.Provider
			value={{
				user,
				session,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
