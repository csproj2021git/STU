import Poll from '../components/Poll'

const PollPage = ({match,getPoll}) => {
    getPoll(match.params.id)

    return (
        <div>
            <Poll/>
        </div>
    )
}

export default PollPage