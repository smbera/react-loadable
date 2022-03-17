import React, { Component } from 'react'

type Config = {
    component: Function,
    LoadingComponent?: any,
}

export default function reactLoadable(config: Config) {
    const { component, LoadingComponent = (() => 'loading...'), delay = 200 } = config

    return class DynamicComponent extends Component {
        mounted = false
        state = {
            FetchComponent: null,
        }
        static now = null
        constructor(props) {
            super(props)
            this.load()
            DynamicComponent.now = Date.now()
        }
        componentDidMount() {
            this.mounted = true
        }
        componentWillUnmount() {
            this.mounted = false
        }
        load() {
            component().then(c => {
                const FetchComponent = Object.values(c)[0]
                if (this.mounted) {
                    this.setState({ FetchComponent })
                } else {
                    this.state.FetchComponent = FetchComponent
                }
            })
        }
        render() {
            const { FetchComponent } = this.state
            if (FetchComponent) return <FetchComponent {...this.props} />

            return Date.now() - DynamicComponent.now > delay ? <LoadingComponent {...this.props} /> : null
        }
    }
}
