function AgentCard({ agent }) {
  return (
    <article className="card p-4">
      <h3 className="text-lg font-semibold">{agent.name}</h3>
      <p className="text-sm text-slate">{agent.email}</p>
      <p className="mt-2 text-sm">
        <span className="font-semibold">Role:</span> {agent.role}
      </p>
    </article>
  );
}

export default AgentCard;
