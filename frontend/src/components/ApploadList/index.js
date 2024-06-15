import ApploadUser from "../AploadUser";

export default function ApploadList({ users }) {
  return (
    <div className="appload-list-container">
      <div className="row">
        <div className="col">
          {(users && users[4] && <ApploadUser user={users[4]} rank={5} />) || (
            <ApploadUser rank={5} />
          )}
        </div>

        <div className="col">
          {(users && users[2] && <ApploadUser user={users[2]} rank={3} />) || (
            <ApploadUser rank={3} />
          )}
        </div>

        <div className="col">
          {(users && users[0] && <ApploadUser user={users[0]} rank={1} />) || (
            <ApploadUser rank={1} />
          )}
        </div>

        <div className="col">
          {(users && users[1] && <ApploadUser user={users[1]} rank={2} />) || (
            <ApploadUser rank={2} />
          )}
        </div>

        <div className="col">
          {(users && users[3] && <ApploadUser user={users[3]} rank={4} />) || (
            <ApploadUser rank={4} />
          )}
        </div>
      </div>
    </div>
  );
}
